package com.xupengboo.flink;

import org.apache.flink.api.common.typeinfo.Types;
import org.apache.flink.api.java.tuple.Tuple2;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;

public class App {
    public static void main(String[] args) throws Exception {
        // 创建执行环境
        final StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

        // 模拟输入数据源
        DataStream<String> text = env.fromElements(
                "hello flink",
                "flink is powerful",
                "hello world"
        );

        // 转换逻辑：分割单词并计数
        DataStream<Tuple2<String, Integer>> wordCounts = text
                .flatMap((String line, org.apache.flink.util.Collector<Tuple2<String, Integer>> out) -> {
                    for (String word : line.split(" ")) {
                        out.collect(new Tuple2<>(word, 1));
                    }
                })
                .returns(Types.TUPLE(Types.STRING, Types.INT))
                .keyBy(0)
                .sum(1);

        // 打印结果
        wordCounts.print();

        // 执行任务
        env.execute("Flink Word Count");
    }
}