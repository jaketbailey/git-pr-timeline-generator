import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
mermaid.initialize({ 
    startOnLoad: true,
    theme: 'default'
});

import { App, Octokit } from "https://esm.sh/octokit";

// Change the token to your own
const token = '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';
// Change the username and repo to your own
const username = "jaketbailey";
const repo = "final-year-project";

const octokit = new Octokit({ auth: token });

String.prototype.trimEllip = function (length) {
    return this.length > length ? this.substring(0, length) + "..." : this;
}

const name = document.createElement("h1");
name.textContent = "";
document.body.appendChild(name);

const p = document.createElement("p");
p.textContent = "Loading...";
document.body.appendChild(p);

const {
    data: { login },
} = await octokit.rest.users.getAuthenticated();
console.log("Hello, %s", login);
name.textContent = `Hello, ${login}`;

const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser();

const prs = await octokit.rest.search.issuesAndPullRequests({
    q: `type:pr+repo:${username}/${repo}+created:>=2022-01-01`,
    per_page: 100,
});

const branchArr = ["main"];

let branchCheck = false;

let mermaidCommit = ``;
mermaidCommit += `---\n`;
mermaidCommit += `title: "@${username}/${repo}"\n`;
mermaidCommit += `---\n`;
mermaidCommit += `gitGraph\n`;
mermaidCommit += `  commit id: "Initial commit"\n`;
let previousBase = "";

let ganttText = `
gantt
    title @${username}/${repo}
    dateFormat  YYYY-MM-DD
`;

let i = 0;
const len = prs.data.items.length;

for (const pr of prs.data.items.reverse()) {
    console.log(`Processing PR ${i + 1} of ${len}`)
    p.textContent = `Processing PR ${i + 1} of ${len}`;
    const { data: prBranch } = await octokit.rest.pulls.get({
        owner: username,
        repo: repo,
        pull_number: pr.number,
    });

    branchCheck = branchArr.includes(prBranch.base.ref);

    if (i === 0) {
        ganttText += `    section ${prBranch.base.ref}\n`;
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
    
    previousBase = prBranch.base.ref;

    const { data: commits } = await octokit.rest.pulls.listCommits({
        owner: username,
        repo: repo,
        pull_number: pr.number,
    });

    if (commits.length > 0) {
        // if date is from month 07 or 08, change to 09
        const checkDate = (date) => {
            // Parse the date string into a Date object
            let dateObj = new Date(date);
        
            // Add 1 month to the date
            dateObj.setMonth(dateObj.getMonth() + 1);
        
            // Add 15 days to the date
            dateObj.setDate(dateObj.getDate() + 15);
        
            // Format the date back into a string in the format YYYY-MM-DD
            let year = dateObj.getFullYear();
            let month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed in JavaScript
            let day = dateObj.getDate().toString().padStart(2, '0');
        
            return `${year}-${month}-${day}`;
        }

        const earliestCommit = commits[0];
        const earlyDate = checkDate(earliestCommit.commit.author.date.split('T')[0]);
        const finalDate = checkDate(prBranch.closed_at.split('T')[0]);


        ganttText += `    ${prBranch.title.trimEllip(25)}     :${earlyDate}, ${finalDate}\n`;
    }

    mermaidCommit += `  commit id: "${await pr.title.trimEllip(25)}"\n`;
    i++;
}

p.style.display = "none";

const gitGraph = document.createElement("pre");
gitGraph.textContent = mermaidCommit;
gitGraph.classList.add("mermaid");
document.body.appendChild(gitGraph);

const gantt = document.createElement("pre");
gantt.textContent = ganttText;
gantt.classList.add("mermaid");
document.body.appendChild(gantt);

console.log(ganttText);

await mermaid.run({ nodes: document.querySelectorAll(".mermaid") });

function downloadSvg(svgElement, filename) {
    // Serialize the SVG to a string
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svgElement);

    // Convert the SVG string to a data URL
    const svgDataUrl = 'data:image/svg+xml;base64,' + btoa(svgStr);

    // Create a new download link
    const downloadLink = document.createElement('a');
    downloadLink.href = svgDataUrl;
    downloadLink.download = filename;

    // Simulate a click on the link
    downloadLink.click();
}

// Get the SVG elements for the diagrams
const gitGraphSvg = gitGraph.querySelector('svg');
const ganttSvg = gantt.querySelector('svg');

// Download the diagrams

if (window.confirm("Do you want to download a copy of the diagrams?")) {
    downloadSvg(gitGraphSvg, 'gitGraph.svg');
    downloadSvg(ganttSvg, 'gantt.svg');
}
