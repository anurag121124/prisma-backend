variable "gcp_sa_key" {
  description = "Path to GCP Service Account Key"
  type        = string
}

variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP Region"
  type        = string
}

variable "service_name" {
  description = "Cloud Run Service Name"
  type        = string
}

variable "image_url" {
  description = "Docker Image URL"
  type        = string
}

variable "cloudsql_instance" {
  description = "Cloud SQL Instance Name"
  type        = string
}

variable "database_user" {
  description = "Database Username"
  type        = string
}

variable "database_password" {
  description = "Database Password"
  type        = string
}

variable "database_host" {
  description = "Cloud SQL Private IP Address"
  type        = string
}

variable "database_name" {
  description = "Database Name"
  type        = string
}

variable "database_port" {
  description = "Database Port"
  type        = string
}
