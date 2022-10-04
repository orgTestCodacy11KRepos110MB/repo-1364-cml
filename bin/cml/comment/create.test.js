const { exec } = require('../../../src/utils');
const fs = require('fs').promises;

describe('Comment integration tests', () => {
  const path = 'comment.md';

  afterEach(async () => {
    try {
      await fs.unlink(path);
    } catch (err) {}
  });

  test('cml send-comment --help', async () => {
    const output = await exec(`node ./bin/cml.js send-comment --help`);

    expect(output).toMatchInlineSnapshot(`
      "cml.js send-comment <markdown file>

      Global Options:
        --log     Logging verbosity
                [string] [choices: \\"error\\", \\"warn\\", \\"info\\", \\"debug\\"] [default: \\"info\\"]
        --driver  Git provider where the repository is hosted
          [string] [choices: \\"github\\", \\"gitlab\\", \\"bitbucket\\"] [default: infer from the
                                                                          environment]
        --repo    Repository URL or slug[string] [default: infer from the environment]
        --token   Personal access token [string] [default: infer from the environment]
        --help    Show help                                                  [boolean]

      Options:
        --pr                      Post to an existing PR/MR associated with the
                                  specified commit           [boolean] [default: true]
        --commit-sha, --head-sha  Commit SHA linked to this comment
                                                            [string] [default: \\"HEAD\\"]
        --publish                 Upload any local images found in the Markdown report
                                                                             [boolean]
        --publish-url             Self-hosted image server URL
                                           [string] [default: \\"https://asset.cml.dev\\"]
        --watch                   Watch for changes and automatically update the
                                  comment                                    [boolean]
        --native                  Uses driver's native capabilities to upload assets
                                  instead of CML's storage; not available on GitHub
                                                                             [boolean]
        --rm-watermark            Avoid watermark; CML needs a watermark to be able to
                                  distinguish CML comments from others       [boolean]"
    `);
  });

  test('cml send-comment to specific repo', async () => {
    const {
      TEST_GITHUB_REPO: repo,
      TEST_GITHUB_TOKEN: token,
      TEST_GITHUB_SHA: sha
    } = process.env;

    const report = `## Test Comment Report specific`;

    await fs.writeFile(path, report);
    await exec(
      `node ./bin/cml.js send-comment --repo=${repo} --token=${token} --commit-sha=${sha} ${path}`
    );
  });

  test('cml send-comment to current repo', async () => {
    const report = `## Test Comment`;

    await fs.writeFile(path, report);
    await exec(`node ./bin/cml.js send-comment ${path}`);
  });

  test('cml send-comment --publish to current repo', async () => {
    const report = `## Test Comment\n![](assets/logo.png)`;

    await fs.writeFile(path, report);
    await exec(`node ./bin/cml.js send-comment --publish ${path}`);
  });
});
