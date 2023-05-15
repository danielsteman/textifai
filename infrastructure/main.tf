terraform {
  required_providers {
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 4.0"
    }
  }
  # cloud {
  #   organization = "textifai"
  #   workspaces {
  #     name = "textifai"
  #   }
  # }
}

provider "google-beta" {
  alias = "gcloud-user"
  user_project_override = false
}
