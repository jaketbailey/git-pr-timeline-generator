# PR to Gantt/Commit Graph (Mermaid.js)

This is a basic web application that utilises the Mermaid library and GitHub Octokit API to generate and visualize Git commit history and pull request timelines in the form of a Git graph and a Gantt chart.

## Prerequisites

- Ensure you have a GitHub account.
- Generate a personal access token on GitHub with the necessary permissions to access the repositories. Replace the `token` variable in the code with your generated token.
- Modify the `username` and `repo` variables in the code to point to your GitHub username and repository name, respectively.

## Installation

This app is built using modern JavaScript ES modules and relies on fetching dependencies directly from CDNs. Therefore, no local installation is required.

## Usage

1. Clone or download the repository.
2. Open a terminal or command prompt in the project directory.
3. Run the following commands to install dependencies and start the server:

```bash
npm install
npm start
