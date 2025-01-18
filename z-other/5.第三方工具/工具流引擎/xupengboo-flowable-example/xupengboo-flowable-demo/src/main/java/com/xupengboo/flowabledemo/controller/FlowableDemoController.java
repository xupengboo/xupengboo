package com.xupengboo.flowabledemo.controller;

import com.alibaba.fastjson.JSON;
import org.apache.commons.lang3.StringUtils;
import org.flowable.engine.ProcessEngine;
import org.flowable.engine.RepositoryService;
import org.flowable.engine.RuntimeService;
import org.flowable.engine.TaskService;
import org.flowable.engine.repository.Deployment;
import org.flowable.engine.repository.ProcessDefinition;
import org.flowable.engine.runtime.ProcessInstance;
import org.flowable.task.api.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Author xupengboo
 * @Date 2024/10/24 10:47
 * @Describe flowable的demo案例：（可以以此为基础展示）
 */
@RestController
public class FlowableDemoController {

    @Autowired
    RepositoryService repositoryService;

    @Autowired
    ProcessEngine processEngine;

    /**
     * 第一步：部署流程图
     */
    @GetMapping("/deploy")
    public void deploy() {
        Deployment deploy = repositoryService
                //创建一个部署
                .createDeployment()
                //部署的流程图
                .addClasspathResource("processes/员工请假流程.bpmn20.xml")
                //这次部署的名字
                .name("员工请假流程")
                //执行部署
                .deploy();
    }

    /**
     * 第二步：获取定义的流程ID
     */
    @GetMapping("/getProcessDefines")
    public List<Map<String,String>> getProcessDefinitions() {
        // 创建流程定义查询
        List<ProcessDefinition> processDefinitions = repositoryService
                .createProcessDefinitionQuery()   // 创建流程定义查询对象
                .orderByProcessDefinitionVersion() // 按流程定义版本排序
                .asc()                             // 升序排列
                .list();                           // 获取查询结果列表
        List<Map<String,String>> list = new ArrayList<>();
        processDefinitions.forEach(item -> {
            Map<String, String> map = new HashMap<>();
            map.put("id", item.getId());
            map.put("name", item.getName());
            map.put("deployment-id", item.getDeploymentId());
            map.put("key", item.getKey());
            System.out.println("定义ID：" + item.getId());
            System.out.println("定义名称：" + item.getName());
            System.out.println("deployment-id：" + item.getDeploymentId());
            System.out.println("key:" + item.getKey());
            list.add(map);
        });
        System.out.println();
        return list;
    }

    /**
     * 删除流程定义
     */
    @GetMapping("/deleteProcessDefines")
    public void deleteProcessDefines(@RequestParam(required = true) String deploymentId) {
        // 单流程删除
        // repositoryService.deleteDeployment(deploymentId);
         try {
            // FIXME 级联删除流程部署，相关的流程实例和任务也会被删除
             repositoryService.deleteDeployment(deploymentId, true);
         } catch (Exception e) {
             e.printStackTrace();
         }
    }

    @Autowired
    RuntimeService runtimeService;

    /**
     * 第三步：启动流程
     */
    @GetMapping("start")
    public void start(@RequestParam(required = false) String key, @RequestParam(required = false) String id) {
        // 流程携带的参数变量：
        Map<String, Object> variables = new HashMap<>();
        variables.put("studentUser", "zhangsan");
        // 根据流程定义的 Key 启动流程：每个流程在 BPMN 文件中有一个唯一的 key，即 <process id="Example01"> 中的 id 属性。
        if (StringUtils.isNotEmpty(key)) {
            ProcessInstance processInstanceByKey = runtimeService.startProcessInstanceByKey(key, variables);
        }
        // 根据流程定义的 ID 启动流程：processDefinitionId 是在 Flowable 引擎中，每次部署后生成的一个唯一 ID，包含版本信息。这个 ID 可能是类似于 "Example01:2:105" 这样的格式。
        if (StringUtils.isNotEmpty(id)) {
            ProcessInstance processInstanceById = runtimeService.startProcessInstanceById(id, variables);
        }
    }

    @Autowired
    TaskService taskService;

    /**
     * 第四步：
     *  查看个人待办的 流程任务
     */
    @GetMapping("/queryTask")
    public List<Map<String,String>> queryTask(String assignee) {
        List<Task> taskList = taskService.createTaskQuery().taskAssignee(assignee).list();
        List<Map<String,String>> list = new ArrayList<>();
        taskList.forEach(item -> {
            Map<String, String> map = new HashMap<>();
            map.put("id", item.getId());
            map.put("name", item.getName());
            map.put("assignee", item.getAssignee());
            map.put("processInstanceId", item.getProcessInstanceId());
            map.put("processDefinitionId", item.getProcessDefinitionId());
            System.out.println("ID：" + item.getId());
            System.out.println("流程名称：" + item.getName());
            System.out.println("发起人：" + item.getAssignee());
            System.out.println("流程实例ID:" + item.getProcessInstanceId());
            System.out.println("流程定义ID:" + item.getProcessDefinitionId());
            list.add(map);
        });
        return list;
    }

    /**
     * 查询组待办的 流程任务
     */
    @GetMapping("/queryGroupTask")
    public List<Map<String,String>> testQueryGroupTask(String group) {
        List<Task> tasks = taskService.createTaskQuery().taskCandidateGroup(group).list();
        List<Map<String,String>> list = new ArrayList<>();
        tasks.forEach(item -> {
            Map<String, String> map = new HashMap<>();
            map.put("id", item.getId());
            map.put("name", item.getName());
            map.put("processInstanceId", item.getProcessInstanceId());
            map.put("processDefinitionId", item.getProcessDefinitionId());
            list.add(map);
        });
        return list;
    }

    /**
     * 第五步：完成审批
     */
    @GetMapping("/complete")
    public void complete(String taskId) {
        taskService.complete(taskId);
    }

}
