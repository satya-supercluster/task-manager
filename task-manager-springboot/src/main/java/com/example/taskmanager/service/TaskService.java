package com.example.taskmanager.service;

import com.example.taskmanager.dto.TaskDto;
import com.example.taskmanager.exception.TaskNotFoundException;
import com.example.taskmanager.mapper.TaskMapper;
import com.example.taskmanager.model.Task;
import com.example.taskmanager.model.User;
import com.example.taskmanager.repository.TaskRepository;
import com.example.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskMapper taskMapper;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Transactional
    public TaskDto createTask(TaskDto taskDto) {
        User user = getCurrentUser();
        Task task = taskMapper.toEntity(taskDto);
        task.setUser(user);
        task.setStatus("PENDING");
        return taskMapper.toDto(taskRepository.save(task));
    }

    @Transactional(readOnly = true)
    public Page<TaskDto> getAllTasks(Pageable pageable) {
        User user = getCurrentUser();
        return taskRepository.findByUserId(user.getId(), pageable)
                .map(taskMapper::toDto);
    }

    @Transactional(readOnly = true)
    public TaskDto getTaskById(Long id) {
        User user = getCurrentUser();
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new TaskNotFoundException("Task not found for this user");
        }
        return taskMapper.toDto(task);
    }

    @Transactional
    public TaskDto updateTask(Long id, TaskDto taskDto) {
        User user = getCurrentUser();
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new TaskNotFoundException("Access Denied");
        }

        taskMapper.updateTaskFromDto(taskDto, task);
        return taskMapper.toDto(taskRepository.save(task));
    }

    @Transactional
    public void deleteTask(Long id) {
        User user = getCurrentUser();
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new TaskNotFoundException("Access Denied");
        }
        taskRepository.delete(task);
    }
}