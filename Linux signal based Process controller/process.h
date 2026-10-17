
#ifndef PROCESS_H
#define PROCESS_H

#include <sys/types.h>

pid_t start_process(void);
int pause_process(pid_t pid);
int resume_process(pid_t pid);
int terminate_process(pid_t pid);
int restart_process(pid_t *pid);
void show_process(pid_t pid);

#endif
