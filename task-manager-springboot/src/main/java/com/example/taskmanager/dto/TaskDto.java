package com.example.taskmanager.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TaskDto {
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private String status;

    @Future(message = "Due date must be in the future")
    private LocalDateTime dueDate;
}