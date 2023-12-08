# yAuto
Vault and strategy automation


#### requirements
make, bun, docker, docker-compose, tmux


## lfg
```sh
make dev
```


## tmux cheats
quit - `ctrl+b`, `:` then `kill-session` (your dev environment will also shutdown gracefully)

pane navigation - `ctrl+b` then `arrow keys`

zoom\unzoom pane - `ctrl+b` then `z`

scroll - `ctrl+b` then `[` then `arrow keys` or `page up\down keys` then `q` to quit scroll mode


## db-migrate cheats
create - `bun migrate create <migration-name> --sql-file`
up - `bun migrate up [name|-c count|...]`
down - `bun migrate down [-c count|...]`


## 'make' sure your dev environment is shutdown lol
```sh
make down
```


## production
```sh
bun run build
```
