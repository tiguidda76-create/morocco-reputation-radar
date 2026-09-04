"""
Pushes all source files and dist of Morocco reputation radar to GitHub tiguidda76-create/morocco-reputation-radar.
"""

import os
import sys
import json
import base64
import time
import requests

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

ROOT = os.path.dirname(os.path.abspath(__file__))
MCP_CONFIG_PATH = r"C:\Users\hp\.gemini\config\mcp_config.json"

with open(MCP_CONFIG_PATH, "r", encoding="utf-8") as f:
    config = json.load(f)

TOKEN = config["mcpServers"]["github"]["env"]["GITHUB_PERSONAL_ACCESS_TOKEN"]
OWNER = "tiguidda76-create"
REPO = "morocco-reputation-radar"
BRANCH = "main"

headers = {
    "Authorization": f"token {TOKEN}",
    "Accept": "application/vnd.github.v3+json",
    "User-Agent": "Morocco-Radar-Deployer"
}

def api_request(method, url, **kwargs):
    kwargs.setdefault("headers", headers)
    kwargs.setdefault("timeout", 30)
    for attempt in range(5):
        try:
            r = requests.request(method, url, **kwargs)
            return r
        except Exception as e:
            time.sleep(2)
            if attempt == 4:
                raise e

def get_all_files():
    file_list = []
    ignore_dirs = {".git", "node_modules", ".agents"}
    ignore_files = {".env"}
    for root_dir, dirs, files in os.walk(ROOT):
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        for f in files:
            if f in ignore_files:
                continue
            full = os.path.join(root_dir, f)
            rel = os.path.relpath(full, ROOT).replace("\\", "/")
            if rel.startswith(".git/") or rel.startswith("node_modules/"):
                continue
            file_list.append(rel)
    return file_list

def get_latest_commit_sha():
    url = f"https://api.github.com/repos/{OWNER}/{REPO}/git/refs/heads/{BRANCH}"
    r = api_request("GET", url)
    if r.status_code != 200:
        raise Exception(f"Failed to get branch ref: {r.status_code} {r.text}")
    return r.json()["object"]["sha"]

def get_base_tree_sha(commit_sha):
    url = f"https://api.github.com/repos/{OWNER}/{REPO}/git/commits/{commit_sha}"
    r = api_request("GET", url)
    if r.status_code != 200:
        raise Exception(f"Failed to get commit: {r.status_code} {r.text}")
    return r.json()["tree"]["sha"]

def create_blobs_and_tree(base_tree_sha, files):
    tree_items = []
    for rel_path in files:
        full_path = os.path.join(ROOT, rel_path.replace("/", os.sep))
        with open(full_path, "rb") as f:
            content_bytes = f.read()

        blob_resp = api_request(
            "POST",
            f"https://api.github.com/repos/{OWNER}/{REPO}/git/blobs",
            json={
                "content": base64.b64encode(content_bytes).decode("utf-8"),
                "encoding": "base64"
            }
        )
        if blob_resp.status_code != 201:
            raise Exception(f"Failed to create blob for {rel_path}: {blob_resp.status_code} {blob_resp.text}")
        
        blob_sha = blob_resp.json()["sha"]
        tree_items.append({
            "path": rel_path,
            "mode": "100644",
            "type": "blob",
            "sha": blob_sha
        })
        print(f"  ✓ Created blob for {rel_path} ({len(content_bytes)} bytes)", flush=True)

    tree_resp = api_request(
        "POST",
        f"https://api.github.com/repos/{OWNER}/{REPO}/git/trees",
        json={
            "base_tree": base_tree_sha,
            "tree": tree_items
        }
    )
    if tree_resp.status_code != 201:
        raise Exception(f"Failed to create tree: {tree_resp.status_code} {tree_resp.text}")
    return tree_resp.json()["sha"]

def create_commit_and_update_ref(tree_sha, parent_commit_sha):
    msg = "feat: Update Morocco Reputation Radar Dashboard to latest production version"
    commit_resp = api_request(
        "POST",
        f"https://api.github.com/repos/{OWNER}/{REPO}/git/commits",
        json={
            "message": msg,
            "tree": tree_sha,
            "parents": [parent_commit_sha]
        }
    )
    if commit_resp.status_code != 201:
        raise Exception(f"Failed to create commit: {commit_resp.status_code} {commit_resp.text}")
    
    new_commit_sha = commit_resp.json()["sha"]
    
    ref_resp = api_request(
        "PATCH",
        f"https://api.github.com/repos/{OWNER}/{REPO}/git/refs/heads/{BRANCH}",
        json={
            "sha": new_commit_sha,
            "force": False
        }
    )
    if ref_resp.status_code != 200:
        raise Exception(f"Failed to update ref: {ref_resp.status_code} {ref_resp.text}")
    
    return new_commit_sha

if __name__ == "__main__":
    print(f"[*] Connecting to GitHub repository {OWNER}/{REPO} on branch '{BRANCH}'...", flush=True)
    parent_sha = get_latest_commit_sha()
    print(f"  ✓ Latest commit SHA: {parent_sha}", flush=True)
    
    base_tree = get_base_tree_sha(parent_sha)
    print(f"  ✓ Base tree SHA: {base_tree}", flush=True)
    
    files = get_all_files()
    print(f"[*] Syncing {len(files)} files...", flush=True)
    
    new_tree = create_blobs_and_tree(base_tree, files)
    print(f"  ✓ New tree created: {new_tree}", flush=True)
    
    new_commit = create_commit_and_update_ref(new_tree, parent_sha)
    print("=" * 60)
    print(f"🚀 SUCCESS: Pushed new commit {new_commit} to GitHub {OWNER}/{REPO}:{BRANCH}")
    print(f"🔗 Commit URL: https://github.com/{OWNER}/{REPO}/commit/{new_commit}")
    print("=" * 60)
