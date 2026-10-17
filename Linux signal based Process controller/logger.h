
#ifndef LOGGER_H
#define LOGGER_H

#include <sys/types.h>

void log_activity(const char *action, pid_t pid, const char *result);

#endif
