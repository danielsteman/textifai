variable "package_names" {
  default = {
    web = {
      name = "textifai-web"
      port = 54321
    }
    chat = {
      name = "textifai-chat"
      port = 54322
    }
    documents = {
      name = "textifai-documents"
      port = 54323
    }
  }
}

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
  type    = string
  default = "latest"
}

locals {
  image_url_prefix = "${var.location}-docker.pkg.dev/${var.project_name}-${var.unique_identifier}/${var.artifact_registry_name}"
  image_urls       = { for key, value in var.package_names : key => "${local.image_url_prefix}/${value.name}:${var.image_tag}" }
}
