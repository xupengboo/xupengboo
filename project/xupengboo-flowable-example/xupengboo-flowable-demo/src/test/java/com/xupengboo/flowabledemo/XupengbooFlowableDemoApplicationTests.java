package com.xupengboo.flowabledemo;

import org.flowable.engine.HistoryService;
import org.flowable.engine.RuntimeService;
import org.flowable.engine.TaskService;
import org.flowable.engine.history.HistoricActivityInstance;
import org.flowable.engine.runtime.ProcessInstance;
import org.flowable.task.api.Task;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.util.CollectionUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@SpringBootTest
class XupengbooFlowableDemoApplicationTests {

    @Autowired
    private RuntimeService runtimeService;

    @Autowired
    private TaskService taskService;

    @Autowired
    private HistoryService historyService;

    @Test
    void sub() {
        // 员工提交请假申请
        Map<String, Object> map = new HashMap<>();
        map.put("day", 5);
        map.put("studentUser", "小明");
        // leave为员工请假流程xml文件中的id
        ProcessInstance a1 = runtimeService.startProcessInstanceByKey("leave", map);

        Task task = taskService.createTaskQuery().processInstanceId(a1.getId()).singleResult();
        taskService.complete(task.getId());
    }


    @Test
    void queryLeadTask() {
        // 查询领导分组的任务
        List<Task> teacher = taskService.createTaskQuery().taskCandidateGroup("a").list();
        for (Task task : teacher) {
            // 根据任务id查询当前任务参数
            Map<String, Object> variables = taskService.getVariables(task.getId());
            System.out.println( "请假天数：" + variables.get("day") + ", 请假人员：" + variables.get("studentUser"));
        }
    }

    @Test
    void queryBossTask() {
        // 查询老板分组的任务
        List<Task> teacher = taskService.createTaskQuery().taskCandidateGroup("b").list();
        for (Task task : teacher) {
            // 根据任务id查询当前任务参数
            Map<String, Object> variables = taskService.getVariables(task.getId());
            System.out.println( "请假天数：" + variables.get("day") + ", 请假人员：" + variables.get("studentUser"));
        }
    }

    @Test
    void LeadApprovalTask() {
        // 领导审批
        List<Task> teacherTaskList = taskService.createTaskQuery().taskCandidateGroup("a").list();
        Map<String, Object> teacherMap = new HashMap<>();
        teacherMap.put("outcome", "通过");
        for (Task teacherTask : teacherTaskList) {
            taskService.complete(teacherTask.getId(), teacherMap);
        }
        System.out.println("领导审批通过");
    }

    @Test
    void boosApprovalTask() {
        // 老板审批
        List<Task> teacherTaskList = taskService.createTaskQuery().taskCandidateGroup("b").list();
        Map<String, Object> teacherMap = new HashMap<>();
        teacherMap.put("outcome", "通过");
        for (Task teacherTask : teacherTaskList) {
            taskService.complete(teacherTask.getId(), teacherMap);
        }
        System.out.println("老板审批通过");
    }

    @Test
    void queryHistory() {
        List<ProcessInstance> processInstance = runtimeService.createProcessInstanceQuery().processDefinitionKey("leave").orderByStartTime().desc().list();
        if (CollectionUtils.isEmpty(processInstance)) {
            System.out.println("------------------------------------------");
        }
        // 获取最近的一个流程
        List<HistoricActivityInstance> activities = historyService.createHistoricActivityInstanceQuery()
                .processInstanceId(processInstance.get(0).getId())
                // 只查询已经完成的活动
                .finished()
                // 按照结束时间排序
                .orderByHistoricActivityInstanceEndTime().desc()
                .list();
        List<String> collect = activities.stream().map(a -> "活动名称:" + a.getActivityName() + ";活动执行时间:" + a.getDurationInMillis() + "毫秒").collect(Collectors.toList());
        for (String s : collect) {
            System.out.println(s);
        }
    }

    @Test
    void Test() {
        // 发起请假
        Map<String, Object> map = new HashMap<>();
        map.put("day", 5);
        map.put("studentUser", "小明");
        ProcessInstance studentLeave = runtimeService.startProcessInstanceByKey("leave", map);
        Task task = taskService.createTaskQuery().processInstanceId(studentLeave.getId()).singleResult();
        taskService.complete(task.getId());

        // 领导审批
        List<Task> teacherTaskList = taskService.createTaskQuery().taskCandidateGroup("a").list();
        Map<String, Object> teacherMap = new HashMap<>();
        teacherMap.put("outcome", "通过");
        for (Task teacherTask : teacherTaskList) {
            taskService.complete(teacherTask.getId(), teacherMap);
        }

        // 老板审批
        List<Task> principalTaskList = taskService.createTaskQuery().taskCandidateGroup("b").list();
        Map<String, Object> principalMap = new HashMap<>();
        principalMap.put("outcome", "通过");
        for (Task principalTask : principalTaskList) {
            taskService.complete(principalTask.getId(), principalMap);
        }

        // 查看历史
        List<HistoricActivityInstance> activities = historyService.createHistoricActivityInstanceQuery()
                .processInstanceId(studentLeave.getId())
                .finished()
                .orderByHistoricActivityInstanceEndTime().asc()
                .list();
        for (HistoricActivityInstance activity : activities) {
            System.out.println(activity.getActivityName());
        }
    }

}
