<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Ratchet\WebSocket\WsServer;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class AppSocket implements MessageComponentInterface
{
    /** @var \SplObjectStorage $clients */
    protected $clients;

    /** @var \React\EventLoop\LoopInterface $loop */
    protected $loop;

    /** @var \React\EventLoop\Timer\TimerInterface $timer */
    protected $timer;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
        $this->enableMotionSensors();
    }

    public function setLoop(\React\EventLoop\LoopInterface $loop) {
        $this->loop = $loop;
    }

    public function onOpen(ConnectionInterface $conn) {
        $this->clients->attach($conn);

        if (!$this->timer) {
            $this->timer = $this->loop->addPeriodicTimer(0.2, function() {
                    $a = $this->readSensor("/sys/class/misc/FreescaleAccelerometer/data");
                    $g = $this->readSensor("/sys/class/misc/FreescaleGyroscope/data");
                    $m = $this->readSensor("/sys/class/misc/FreescaleMagnetometer/data");

                    foreach ($this->clients as $client) {
                        $client->send(json_encode([
                            'accelerometer' => $a,
                            'gyroscope' => $g,
                            'magnetometer' => $m,
                        ]));
                    }
                });
        }
    }

    public function onMessage(ConnectionInterface $from, $msg) {
    }

    public function onClose(ConnectionInterface $conn) {
        $this->clients->detach($conn);

        if ($this->clients->count() === 0 && $this->timer) {
            $this->loop->cancelTimer($this->timer);
            $this->timer = null;
        }
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        $conn->close();
    }

    private function readSensor($fileName) {
        if (!file_exists($fileName)) {
            return [
                'modulus' => 0,
                'axis' => [0, 0, 0]
            ];
        }
        $data = file_get_contents($fileName);
        if (!$data) {
            return [
                'modulus' => 0,
                'axis' => [0, 0, 0]
            ];
        }

        $axis = explode(",", $data);
        $axis = [(int)$axis[0], (int)$axis[1], (int)$axis[2]];
        $modulus = sqrt($axis[0] * $axis[0] + $axis[1] * $axis[1] + $axis[2] * $axis[2]);

        return [
            'modulus' => $modulus,
            'axis' => $axis
        ];
    }

    private function enableMotionSensors() {
        foreach ([
                     "/sys/class/misc/FreescaleGyroscope/enable",
                     "/sys/class/misc/FreescaleAccelerometer/enable",
                     "/sys/class/misc/FreescaleMagnetometer/enable",
                 ] as $sensor) {
            if (file_exists($sensor)) {
                file_put_contents($sensor, 1);
            }
        }
    }
}



$app = new AppSocket;
$server = IoServer::factory(new HttpServer(new WsServer($app)), 57120);
$app->setLoop($server->loop);

$server->run();
