#!/usr/bin/env python

import sys
import PAM

if len(sys.argv) == 3:
	username = sys.argv[1]
	password = sys.argv[2]
else:
	exit(1)

def is_authorized(username, password):
    pam_auth = PAM.pam()
    pam_auth.start("login")
    pam_auth.set_item(PAM.PAM_USER, username)

    def _pam_conv(auth, query_list, user_data = None):
        resp = []
        for i in range(len(query_list)):
            query, qtype = query_list[i]
            if qtype == PAM.PAM_PROMPT_ECHO_ON:
                resp.append((username, 0))
            elif qtype == PAM.PAM_PROMPT_ECHO_OFF:
                resp.append((password, 0))
            else:
                return None
        return resp

    pam_auth.set_item(PAM.PAM_CONV, _pam_conv)

    try:
        pam_auth.authenticate()
        pam_auth.acct_mgmt()
    except PAM.error, resp:
        return 1
    except Exception, e:
        log.warn("Error with PAM: %s" % str(e))
        return 1
    else:
        return 0


exit(is_authorized(username, password))
