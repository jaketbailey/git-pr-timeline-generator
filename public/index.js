import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
mermaid.initialize({ startOnLoad: true });

import { App, Octokit } from "https://esm.sh/octokit";
const token = '';
const username = "jaketbailey";
const repo = "final-year-project";

const octokit = new Octokit({ auth: token });

const {
    data: { login },
} = await octokit.rest.users.getAuthenticated();
console.log("Hello, %s", login);

const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser();
console.log(repos);

const prs = await octokit.rest.search.issuesAndPullRequests({
    q: `type:pr+repo:${username}/${repo}+created:>=2022-01-01`,
    per_page: 100,
});

const branchArr = ["main"];

let branchCheck = false;

let mermaidCommit = ``;
mermaidCommit += `---\n`;
mermaidCommit += `title: "@jaketbailey/final-year-project"\n`;
mermaidCommit += `---\n`;
mermaidCommit += `gitGraph\n`;
mermaidCommit += `  commit id: "Initial commit"\n`;
let previousBase = "";

let ganttText = `
gantt
    title Final Year Project
    dateFormat  YYYY-MM-DD
`;

let i = 0;
const len = prs.data.items.length;

for (const pr of prs.data.items.reverse()) {
    console.log(`Processing PR ${i + 1} of ${len}`)
    const { data: prBranch } = await octokit.rest.pulls.get({
        owner: username,
        repo: repo,
        pull_number: pr.number,
    });

    branchCheck = branchArr.includes(prBranch.base.ref);

    if (i === 0) {
        ganttText += `    section ${prBranch.base.ref}\n`;co
        mermaidCommit += `  branch ${prBranch.base.ref}\n`
        mermaidCommit += `  checkout ${prBranch.base.ref}\n`;
    } else {
        if (prBranch.base.ref !== previousBase) {
            if (prBranch.base.ref !== "main") {
                if (!mermaidCommit.includes(`branch ${prBranch.base.ref}`)) {
                    mermaidCommit += `  branch ${prBranch.base.ref}\n`
                }
                branchArr.push(prBranch.base.ref);

                ganttText += `    section ${prBranch.base.ref}\n`;
                mermaidCommit += `  checkout ${prBranch.base.ref}\n`;
            } else {
                mermaidCommit += `  checkout main\n`;
                mermaidCommit += `  merge ${previousBase}\n`;
            }
        }
    }
    
    console.log(prBranch);

    previousBase = prBranch.base.ref;

    const { data: commits } = await octokit.rest.pulls.listCommits({
        owner: username,
        repo: repo,
        pull_number: pr.number,
    });

    if (commits.length > 0) {
        const earliestCommit = commits[0];
        console.log("Earliest commit:", earliestCommit.commit.author.date.split('T')[0]);
        ganttText += `    ${prBranch.title}     :${earliestCommit.commit.author.date.split('T')[0]}, ${prBranch.closed_at.split('T')[0]}\n`;
    }

    mermaidCommit += `  commit id: "${pr.title}"\n`;
    i++;
}

const gitGraph = document.createElement("pre");
gitGraph.textContent = mermaidCommit;
gitGraph.classList.add("mermaid");
document.body.appendChild(gitGraph);
console.log(merges);

const gantt = document.createElement("pre");
gantt.textContent = ganttText;
console.log(gantt.textContent);
gantt.classList.add("mermaid");
document.body.appendChild(gantt);

await mermaid.run({ nodes: document.querySelectorAll(".mermaid") });