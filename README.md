# commandcode-go-for-dsh

Command Code Go as a model provider in [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness). Works on the official **Web** UI (`dsh web`) and the community **TUI** (`dsh --profile tui`).

Port of [`commandcode-go-for-pi`](https://github.com/gonegirl07/commandcode-go-for-pi) plus [`commandcode-usage-for-pi`](https://github.com/gonegirl07/commandcode-usage-for-pi):

- Route `commandcode` calls `POST https://api.commandcode.ai/alpha/generate`.
- Host slash commands `/cc-usage` and `/ccusage` print plan credits and rolling limits.

Unofficial. Not affiliated with Command Code or DeepSeek. `/alpha` is undocumented and can change.

Ubuntu install script and guide: [deepseek-harness-ubuntu](https://github.com/gonegirl07/deepseek-harness-ubuntu).

## Install

Add the plugin to **each** profile you use. Settings and credentials are shared; plugins are not.

```console
dsh plugin --profile tui add github:gonegirl07/commandcode-go-for-dsh
dsh plugin --profile web add github:gonegirl07/commandcode-go-for-dsh
```

Restart the app after install (`dsh --profile tui` or `dsh web`). Refresh the browser if Web was already open.

`dsh web` listens on `127.0.0.1` only. Other LAN devices cannot open it unless you SSH-tunnel or bind a specific LAN IP (not `0.0.0.0` — DSH rejects that). LAN notes live in the [Ubuntu install guide](https://github.com/gonegirl07/deepseek-harness-ubuntu).

## Auth

A `user_...` key from [Command Code settings](https://commandcode.ai/settings). Never commit it.

```bash
export COMMANDCODE_API_KEY="user_..."
```

Or `~/.dsh/.credentials.yaml` (mode `600`):

```yaml
COMMANDCODE_API_KEY: user_...
```

## Pick a model

Useful defaults: `deepseek/deepseek-v4-pro`, `deepseek/deepseek-v4-flash`.

| Surface | How |
| --- | --- |
| TUI | `/model` → Command Code Go → `s` (first row is Pro) |
| Web | Settings → Models, or the composer model picker |

The plugin seeds the official Command Code catalog (DeepSeek, Kimi, GLM, MiniMax, MiMo, Qwen, Step, Hy3, Nemotron, Inkling, Laguna, Fugu, Muse Spark, plus Claude / GPT / Gemini / Grok). Closed-source ids often need Pro/Max.

Optional default (no secrets):

```yaml
# ~/.dsh/settings.yaml
agent-default-model:
  provider: commandcode
  model: deepseek/deepseek-v4-pro
  reasoningEffort: high
```

## Usage

In the TUI prompt or the Web composer:

```
/cc-usage
```

`/ccusage` is the same host command (not a model prompt). It must appear in the `/` menu. If it does not, restart `dsh web` and refresh.

```
Command Code  individual-go
Month   $8.77 / $10 left
5-hour  $0.14 / $3    reset Aug 16, 19:15
Week    $1.23 / $6    reset Aug 22, 10:44
Cycle   ends Sep 15, 2026
```

## Reasoning

DeepSeek V4 Pro / Flash accept only these levels:

| DSH | Request |
| --- | --- |
| `off` | omit `params.reasoning_effort` |
| `high` | `params.reasoning_effort: "high"` |
| `max` | `params.reasoning_effort: "max"` |

Other levels are not forwarded. Pro still thinks when effort is omitted.

## Remove

```console
dsh plugin --profile tui remove commandcode-go-for-dsh
dsh plugin --profile web remove commandcode-go-for-dsh
```

## Development

```console
npm test
```

## License

[MIT](LICENSE)
