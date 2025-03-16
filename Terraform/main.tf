provider "google" {
  credentials = file(var.gcp_sa_key)
  project     = var.project_id
  region      = var.region
}

resource "google_cloud_run_service" "backend" {
  name     = var.service_name
  location = var.region

  template {
    spec {
      containers {
        image = var.image_url

        ports {
          container_port = 8080
        }

        env {
          name  = "DATABASE_URL"
          value = "postgresql://${var.database_user}:${var.database_password}@${var.database_host}:${var.database_port}/${var.database_name}"
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

resource "google_cloud_run_service_iam_policy" "noauth" {
  location = google_cloud_run_service.backend.location
  service  = google_cloud_run_service.backend.name

  policy_data = <<EOF
{
  "bindings": [
    {
      "role": "roles/run.invoker",
      "members": ["allUsers"]
    }
  ]
}
EOF
}

resource "google_sql_database_instance" "instance" {
  name             = var.cloudsql_instance
  database_version = "POSTGRES_13"
  region           = var.region

  settings {
    tier = "db-f1-micro"
  }
}

resource "google_sql_user" "user" {
  name     = var.database_user
  instance = google_sql_database_instance.instance.name
  password = var.database_password
}

output "cloud_run_url" {
  value = google_cloud_run_service.backend.status[0].url
}

output "cloudsql_instance_name" {
  value = google_sql_database_instance.instance.name
}
