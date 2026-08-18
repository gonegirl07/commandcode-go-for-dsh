# commandcode-go-for-dsh

Use a [Command Code](https://commandcode.ai) Go plan as a model provider in [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).

This is a port of [`commandcode-go-for-pi`](https://github.com/gonegirl07/commandcode-go-for-pi) plus [`commandcode-usage-for-pi`](https://github.com/gonegirl07/commandcode-usage-for-pi):

- Provider route `commandcode` talks to `POST https://api.commandcode.ai/alpha/generate` (the CLI envelope every plan permits).
- Slash command `/cc-usage` shows monthly credits and the 5-hour / weekly rolling limits.

Unofficial and not affiliated with Command Code or DeepSeek. The extension uses undocumented `/alpha` routes that may change.

## Install

```console
dsh plugin --profile tui add github:gonegirl07/commandcode-go-for-dsh
```

Restart `dsh` after installing. The same add works with `--profile web` or `--profile headless`.

## Auth

A `user_...` key from [Command Code settings](https://commandcode.ai/settings). Store it as `COMMANDCODE_API_KEY`:

```bash
export COMMANDCODE_API_KEY="user_..."
```

Or write it to `~/.dsh/.credentials.yaml` (mode `600`):

```yaml
COMMANDCODE_API_KEY: user_...
```

Then pick **Command Code Go** in the TUI `/model` overlay and press `s` (activates the first listed model). The plugin seeds the full Command Code catalog into settings; the default useful ids are:

- `deepseek/deepseek-v4-pro`
- `deepseek/deepseek-v4-flash`

The roster also includes Kimi, GLM, MiniMax, MiMo, Qwen, Step, Tencent Hy3, Nemotron, Inkling, Laguna, Fugu, Muse Spark, plus the closed-source lanes (Claude, GPT, Gemini, Grok). Those last four often need a Pro/Max plan — a Go key may reject them.

## Usage

In TUI or the Web composer (`dsh web`), type:

```
/cc-usage
```

`/ccusage` is the same command. It is a host slash command (not a model prompt); wait until it appears in the `/` picker after restarting `dsh web`.

Example:

```
Command Code  individual-go
Month   $8.77 / $10 left
5-hour  $0.14 / $3    reset Aug 16, 19:15
Week    $1.23 / $6    reset Aug 22, 10:44
Cycle   ends Sep 15, 2026
```

To pre-select Pro with reasoning `high`, put this in `~/.dsh/settings.yaml`:

```yaml
agent-default-model:
  provider: commandcode
  model: deepseek/deepseek-v4-pro
  reasoningEffort: high
```

## Reasoning

DeepSeek V4 Pro / Flash expose only the levels Command Code accepts:

| DSH level | Request |
| --- | --- |
| `off` | Omits `params.reasoning_effort` |
| `high` | `params.reasoning_effort: "high"` |
| `max` | `params.reasoning_effort: "max"` |

Unsupported levels are not forwarded.

## Remove

```console
dsh plugin --profile tui remove commandcode-go-for-dsh
```

## Development

```console
npm test
```

## License

[MIT](LICENSE)
