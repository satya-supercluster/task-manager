package com.example.taskmanager.mapper;

import com.example.taskmanager.dto.TaskDto;
import com.example.taskmanager.model.Task;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    TaskDto toDto(Task task);
    Task toEntity(TaskDto dto);
    void updateTaskFromDto(TaskDto dto, @MappingTarget Task task);
}