resource "google_firebase_hosting_site" "dev" {
  provider = google-beta
  project  = google_project.dev.project_id
  site_id  = "${google_project.dev.project_id}-site"
  app_id   = google_firebase_web_app.dev.app_id
}

resource "google_firebase_hosting_version" "dev" {
  provider = google-beta
  site_id  = google_firebase_hosting_site.dev.site_id
  config {
    rewrites {
      glob = "/api/documents/**"
      run {
        service_id = google_cloud_run_v2_service.service["documents"].name
        region     = google_cloud_run_v2_service.service["documents"].location
      }
    }

    rewrites {
      glob = "/api/chat/**"
      run {
        service_id = google_cloud_run_v2_service.service["chat"].name
        region     = google_cloud_run_v2_service.service["chat"].location
      }
    }

    rewrites {
      glob = "/**"
      run {
        service_id = google_cloud_run_v2_service.service["web"].name
        region     = google_cloud_run_v2_service.service["web"].location
      }
    }
  }
}

resource "google_firebase_hosting_release" "dev" {
  provider     = google-beta
  site_id      = google_firebase_hosting_site.dev.site_id
  version_name = google_firebase_hosting_version.dev.name
  message      = "Cloud Run Integration"
}
