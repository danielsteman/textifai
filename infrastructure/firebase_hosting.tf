
# resource "google_firebase_hosting_site" "default" {
#   provider = google-beta
#   project  = google_project.default.project_id
#   site_id = "site-with-channel"
#   app_id = google_firebase_web_app.default.app_id
# }

# resource "google_firebase_hosting_channel" "default" {
#   provider = google-beta
#   site_id = google_firebase_hosting_site.default.site_id
#   channel_id = "channel-basic"
# }