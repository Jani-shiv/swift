"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function TerraformBuilder() {
  const [resource, setResource] = useState("aws_s3_bucket");
  const [name, setName] = useState("prod_app_storage");
  const [region, setRegion] = useState("us-east-1");
  const [environment, setEnvironment] = useState("production");
  const [addBackend, setAddBackend] = useState(true);
  const [addKms, setAddKms] = useState(true);
  const [addOutput, setAddOutput] = useState(true);

  const generate = () => {
    let hcl = `terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.30"
    }
    kms = {
      source  = "hashicorp/aws"
      version = "~> 5.30"
    }
  }\n`;

    if (addBackend) {
      hcl += `  backend "s3" {
    bucket         = "tf-state-store-${environment}"
    key            = "infrastructure/v1/${name}/terraform.tfstate"
    region         = "${region}"
    dynamodb_table = "tf-state-locks-${environment}"
    encrypt        = true
  }\n`;
    }

    hcl += `}\n\nprovider "aws" {
  region = "${region}"
  default_tags {
    tags = {
      Environment = "${environment}"
      ManagedBy   = "Terraform"
      Repository  = "infra-live"
      Owner       = "DevOps"
    }
  }
}\n\n`;

    if (resource === "aws_s3_bucket") {
      hcl += `resource "aws_s3_bucket" "${name}" {
  bucket        = "company-${environment}-${name.replace(/_/g, "-")}"
  force_destroy = false
}

resource "aws_s3_bucket_versioning" "${name}_versioning" {
  bucket = aws_s3_bucket.${name}.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "${name}_crypto" {
  bucket = aws_s3_bucket.${name}.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "${addKms ? "aws:kms" : "AES256"}"
      ${addKms ? `kms_master_key_id = aws_kms_key.${name}_key.arn` : ""}
    }
  }
}

resource "aws_s3_bucket_public_access_block" "${name}_privacy" {
  bucket = aws_s3_bucket.${name}.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}\n`;

      if (addKms) {
        hcl += `\nresource "aws_kms_key" "${name}_key" {
  description             = "KMS key for ${name} SSE"
  deletion_window_in_days = 30
  enable_key_rotation     = true
}\n`;
      }
    } else if (resource === "aws_vpc") {
      hcl += `module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.4.0"

  name = "${name}-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["${region}a", "${region}b", "${region}c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway     = true
  single_nat_gateway    = false
  enable_vpn_gateway    = false
  enable_dns_hostnames  = true
  enable_dns_support    = true
}\n`;
    } else if (resource === "aws_security_group") {
      hcl += `resource "aws_security_group" "${name}" {
  name        = "${name}-sg"
  description = "Enterprise Security Group for ${name}"
  vpc_id      = "vpc-0123456789abcdef0"

  ingress {
    description = "TLS HTTPS ingress from internal VPC"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  egress {
    description = "Outbound egress to all internet endpoints"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}\n`;
    }

    if (addOutput) {
      hcl += `\noutput "${name}_id" {
  value       = ${resource === "aws_vpc" ? "module.vpc.vpc_id" : `aws_${resource === "aws_s3_bucket" ? "s3_bucket" : "security_group"}.${name}.id`}
  description = "Identifier for ${name}"
}`;
    }

    return hcl;
  };

  const output = generate();

  return (
    <ToolLayout title="Terraform Enterprise HCL Architect" description="Generate enterprise-grade Terraform HCL with S3 Remote Backend, DynamoDB Locking, KMS Encryption, and VPC Modules." icon="🏛️">
      <div className="tool-grid">
        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 800 }}>Architecture Parameters</h3>
          <label className="field-label">Target Component</label>
          <select className="select-field" value={resource} onChange={e => setResource(e.target.value)} style={{ marginBottom: "0.75rem" }}>
            <option value="aws_s3_bucket">Encrypted S3 Storage Bucket</option>
            <option value="aws_vpc">AWS VPC Multi-AZ Module</option>
            <option value="aws_security_group">Strict Security Group</option>
          </select>

          <label className="field-label">Resource / Module Name</label>
          <input className="input-field" value={name} onChange={e => setName(e.target.value)} style={{ marginBottom: "0.75rem" }} />

          <label className="field-label">AWS Region</label>
          <select className="select-field" value={region} onChange={e => setRegion(e.target.value)} style={{ marginBottom: "0.75rem" }}>
            {["us-east-1", "us-west-2", "eu-west-1", "eu-central-1", "ap-south-1", "ap-southeast-1"].map(r => <option key={r} value={r}>{r}</option>)}
          </select>

          <label className="field-label">Environment Tier</label>
          <select className="select-field" value={environment} onChange={e => setEnvironment(e.target.value)} style={{ marginBottom: "0.75rem" }}>
            <option value="production">production</option>
            <option value="staging">staging</option>
            <option value="sandbox">sandbox</option>
          </select>

          <div className="toggle-wrapper">
            <input type="checkbox" checked={addBackend} onChange={e => setAddBackend(e.target.checked)} id="back" />
            <label htmlFor="back" className="toggle-label">Include Remote S3 Backend &amp; DynamoDB Lock</label>
          </div>
          <div className="toggle-wrapper">
            <input type="checkbox" checked={addKms} onChange={e => setAddKms(e.target.checked)} id="kms" />
            <label htmlFor="kms" className="toggle-label">Include Customer-Managed KMS Key (SSE-KMS)</label>
          </div>
          <div className="toggle-wrapper">
            <input type="checkbox" checked={addOutput} onChange={e => setAddOutput(e.target.checked)} id="out" />
            <label htmlFor="out" className="toggle-label">Include Terraform Outputs Block</label>
          </div>
        </div>

        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 800 }}>Production HCL Code</h3>
          <div className="code-output" style={{ position: "relative" }}>
            <CopyButton text={output} />
            {output}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
