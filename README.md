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

Then pick **Command Code Go** in the model picker. Default useful models:

- `deepseek/deepseek-v4-flash`
- `deepseek/deepseek-v4-pro`

## Usage

```
/cc-usage
```

Example:

```
Command Code  individual-go
Month   $8.77 / $10 left
5-hour  $0.14 / $3    reset Aug 16, 19:15
Week    $1.23 / $6    reset Aug 22, 10:44
Cycle   ends Sep 15, 2026
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
