
#ifndef SIGNALS_H
#define SIGNALS_H

#include <sys/types.h>

int send_process_signal(pid_t pid, int signal_number);
char get_process_state(pid_t pid);

#endif
