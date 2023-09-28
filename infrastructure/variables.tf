variable "project_name" {
  type    = string
  default = "textifai"
}

variable "artifact_registry_name" {
  type    = string
  default = "textifai-registry"
}

variable "location" {
  type    = string
  default = "europe-west4"
}

variable "billing_account" {
  type    = string
  default = "01C220-00DCED-92B0FE"
}

variable "unique_identifier" {
  type    = string
  default = "g5njdml004"
}

variable "organisation_id" {
  type    = string
  default = ""
}

variable "GOOGLE_CREDENTIALS" {
  type      = string
  sensitive = true
}

variable "web_app_display_name" {
  type    = string
  default = "textifai"
}

variable "oauth_client_secret" {
  type        = string
  description = "OAuth client secret. In a real app, you should use a secret manager service."
  sensitive   = true
}

variable "image_tag" {
  type = string
}

locals {
  image_url_prefix = "${var.location}-docker.pkg.dev/${var.project_name}-${unique_identifier}/${var.artifact_registry_name}"
  web_image_url = "${local.image_url_prefix}/web"
  chat_image_url = "${local.image_url_prefix}/chat"
  documents_image_url = "${local.image_url_prefix}/documents"
}