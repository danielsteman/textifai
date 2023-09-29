# resource "google_firebase_hosting_site" "default" {
#   provider = google-beta
#   project  = google_project.default.project_id
#   site_id = "site-with-channel"
#   app_id = google_firebase_web_app.default.app_id
# }

# resource "google_firebase_hosting_version" "documents" {
#   provider = google-beta
#   site_id  = google_firebase_hosting_site.default.site_id
#   config {
#     rewrites {
#       glob = "/api/documents/**"
#       run {
#         service_id = google_cloud_run_v2_service.service["documents"].name
#         region = google_cloud_run_v2_service.service["documents"].location
#       }
#     }
#   }
# }
