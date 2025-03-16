terraform {
  backend "gcs" {
    bucket = "innate-rite-447114-h4_cloudbuild"  # Use your existing GCS bucket
    prefix = "terraform/state"
  }
}
