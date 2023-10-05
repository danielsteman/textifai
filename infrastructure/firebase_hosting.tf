resource "google_firebase_hosting_site" "default" {
  provider = google-beta
  project  = google_project.default.project_id
  site_id = "${google_project.default.project_id}-site"
  app_id = google_firebase_web_app.default.app_id
}

resource "google_firebase_hosting_version" "documents" {
  provider = google-beta
  site_id  = google_firebase_hosting_site.default.site_id
  config {
    rewrites {
      glob = "/api/documents/**"
      run {
        service_id = google_cloud_run_v2_service.service["documents"].name
        region = google_cloud_run_v2_service.service["documents"].location
      }
    }
  }
}

resource "google_firebase_hosting_release" "documents" {
  provider     = google-beta
  site_id      = google_firebase_hosting_site.default.site_id
  version_name = google_firebase_hosting_version.documents.name
  message      = "Cloud Run Integration with Documents service"
}

resource "google_firebase_hosting_version" "chat" {
  provider = google-beta
  site_id  = google_firebase_hosting_site.default.site_id
  config {
    rewrites {
      glob = "/api/chat/**"
      run {
        service_id = google_cloud_run_v2_service.service["chat"].name
        region = google_cloud_run_v2_service.service["chat"].location
      }
    }
  }
}

resource "google_firebase_hosting_release" "chat" {
  provider     = google-beta
  site_id      = google_firebase_hosting_site.default.site_id
  version_name = google_firebase_hosting_version.chat.name
  message      = "Cloud Run Integration with Chat service"
}

resource "google_firebase_hosting_version" "web" {
  provider = google-beta
  site_id  = google_firebase_hosting_site.default.site_id
  config {
    rewrites {
      glob = "/**"
      run {
        service_id = google_cloud_run_v2_service.service["web"].name
        region = google_cloud_run_v2_service.service["web"].location
      }
    }
  }
}

resource "google_firebase_hosting_release" "web" {
  provider     = google-beta
  site_id      = google_firebase_hosting_site.default.site_id
  version_name = google_firebase_hosting_version.web.name
  message      = "Cloud Run Integration with Web frontend"
}