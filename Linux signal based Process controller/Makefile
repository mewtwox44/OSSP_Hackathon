cd ~/Linux-Signal-Process-Controller

cat > Makefile <<'MAKEFILE'
CC = gcc
CFLAGS = -Wall -Wextra -Iinclude

SOURCES = src/main.c src/process.c src/signals.c src/logger.c

all: worker controller

worker: src/worker.c
	$(CC) $(CFLAGS) src/worker.c -o worker

controller: $(SOURCES)
	$(CC) $(CFLAGS) $(SOURCES) -o controller

clean:
	rm -f controller worker

.PHONY: all clean
MAKEFILE
