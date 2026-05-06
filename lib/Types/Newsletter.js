"use strict"

Object.defineProperty(exports, "__esModule", { value: true })

const MexOperations = {
    PROMOTE: "NotificationNewsletterAdminPromote",
    DEMOTE: "NotificationNewsletterAdminDemote",
    UPDATE: "NotificationNewsletterUpdate"
}

const XWAPaths = {
    PROMOTE: "xwa2_notify_newsletter_admin_promote",
    DEMOTE: "xwa2_notify_newsletter_admin_demote",
    ADMIN_COUNT: "xwa2_newsletter_admin",
    CREATE: "xwa2_newsletter_create",
    NEWSLETTER: "xwa2_newsletter",
    SUBSCRIBED: "xwa2_newsletter_subscribed", 
    METADATA_UPDATE: "xwa2_notify_newsletter_on_metadata_update",
    JOIN_V2: "xwa2_newsletter_join_v2",
    LEAVE_V2: "xwa2_newsletter_leave_v2",
    REACHOUT_TIMELOCK: "xwa2_fetch_account_reachout_timelock",
    MESSAGE_CAPPING_INFO: "xwa2_message_capping_info"
}

const QueryIds = {
    JOB_MUTATION: "7150902998257522",
    METADATA: "6620195908089573",
    UNFOLLOW: "9767147403369991",
    FOLLOW: "24404358912487870",
    UNMUTE: "7337137176362961",
    MUTE: "25151904754424642",
    CREATE: "6996806640408138",
    ADMIN_COUNT: "7130823597031706",
    CHANGE_OWNER: "7341777602580933",
    DELETE: "8316537688363079",
    DEMOTE: "6551828931592903", 
    SUBSCRIBED: "6388546374527196",
    REACHOUT_TIMELOCK: "23983697327930364",
    MESSAGE_CAPPING_INFO: "24503548349331633"
}

module.exports = {
  MexOperations,
  XWAPaths,
  QueryIds
}
