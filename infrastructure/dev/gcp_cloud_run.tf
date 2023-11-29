resource "google_cloud_run_v2_service" "service" {
  for_each = var.package_names

  name     = each.value.name
  location = var.location
  project  = google_project.dev.project_id
  client   = "terraform"

  template {
    containers {
      image = local.image_urls[each.key]
      ports {
        container_port = each.value.port
      }
      env {
        name  = "NODE_ENV"
        value = "production"
      }
    }
  }
}

resource "google_cloud_run_v2_service_iam_member" "noauth" {
  for_each = var.package_names

  location = google_cloud_run_v2_service.service[each.key].location
  project  = google_project.dev.project_id
  name     = google_cloud_run_v2_service.service[each.key].name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
