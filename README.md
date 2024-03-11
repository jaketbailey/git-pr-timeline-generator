# PR to Gantt/Commit Graph (Mermaid.js)

This is a basic web application that utilises the Mermaid library and GitHub Octokit API to generate and visualize Git commit history and pull request timelines in the form of a Git graph and a Gantt chart.

## Prerequisites

- Ensure you have a GitHub account.
- Generate a personal access token on GitHub with the necessary permissions to access the relevant repository. Replace the `token` variable in the code with your generated token.
- Modify the code's `username` and `repo` variables to point to your GitHub username and repository name, respectively.

## Usage

1. Clone or download the repository.
2. Open a terminal or command prompt in the project directory.
3. Run the following commands to install dependencies and start the server:

```bash
npm install
npm start
