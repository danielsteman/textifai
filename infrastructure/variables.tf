variable "project_name" {
  type    = string
  default = "textifai"
}

variable "project_id" {
  type    = string
  default = "textifai"
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
  default = ""
}

variable "web_app_display_name" {
  type = string
  default = "textifai"
}

variable "oauth_client_secret" {
  type = string
  description = "OAuth client secret. In a real app, you should use a secret manager service."
  sensitive = true
}
