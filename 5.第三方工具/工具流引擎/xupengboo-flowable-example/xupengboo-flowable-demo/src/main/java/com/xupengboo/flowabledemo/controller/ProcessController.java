package com.xupengboo.flowabledemo.controller;

import com.xupengboo.flowabledemo.bean.TaskDTO;
import org.flowable.engine.RuntimeService;
import org.flowable.engine.TaskService;
import org.flowable.engine.runtime.ProcessInstance;
import org.flowable.task.api.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

/**
 * @Author xupengboo
 * @Date 2024/9/24 14:07
 * @Describe demo
 */
@RestController
public class ProcessController {

    @Autowired
    private RuntimeService runtimeService;

    @Autowired
    private TaskService taskService; // 注入 TaskService

    /**
     * 开启一个流程
     * @return string
     */
    @GetMapping("/start-process")
    public String startProcess() {
        ProcessInstance processInstance = runtimeService.startProcessInstanceByKey("simpleProcess");
        return "Process started. ID: " + processInstance.getId();
    }

    /**
     * 查看当前正在执行的流程
     * @return List<TaskDTO>
     */
    @GetMapping("/tasks")
    public List<TaskDTO> getTasks() {
        List<Task> tasks = taskService.createTaskQuery().list();
        List<TaskDTO> taskDTOs = new ArrayList<>();
        for (Task task : tasks) {
            taskDTOs.add(new TaskDTO(task.getId(), task.getName()));
        }
        return taskDTOs;
    }

    /**
     * 将某个流程执行成功。
     * @param taskId 任务ID
     * @return string
     */
    @GetMapping("/complete-task")
    public String completeTask(String taskId) {
        taskService.complete(taskId);
        return "Task completed.";
    }

}