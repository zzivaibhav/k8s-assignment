variable "project_id" {
  description = "urban-assist-455103"
  type        = string
  default     = "urban-assist-455103"
}

variable "project_number" {
  description = "2431049737"
  type        = string
  default     = "2431049737"
  
}
variable "region" {
  description = "us-central1"
  type        = string
  default     = "us-central1"
}

variable "gke_cluster_name" {
  description = "ua-kube"
  type        = string
  default     = "ua-kube"
}

variable "artifact_registry_name" {
  description = "ua-artifact"
  type        = string
  default     = "ua-artifact"
}

variable "github_owner" {
  description = "zzivaibhav"
  type        = string
  default     = "zzivaibhav"
}

variable "github_repo" {
  description = "k8s-assignment"
  type        = string
  default     = "k8s-assignment"
}

variable "trigger_branch" {
  description = "^main$"
  type        = string
  default     = "^main$"
  
}

variable "git_uri" {
  description = "https://github.com/zzivaibhav/k8s-assignment.git"
  type        = string
  default     = "https://github.com/zzivaibhav/k8s-assignment.git"
}

 