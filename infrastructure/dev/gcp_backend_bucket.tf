resource "google_compute_backend_bucket" "dev" {
  name        = "image-backend-bucket"
  bucket_name = google_storage_bucket.dev.name
  enable_cdn  = true
  project     = google_project.dev.id
}

resource "google_storage_bucket" "dev" {
  name     = "image-store-bucket"
  location = "EUROPE-WEST4"
  project  = google_project.dev.id
}
