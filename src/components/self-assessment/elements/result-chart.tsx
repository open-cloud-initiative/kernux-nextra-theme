// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import { FunctionComponent, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Props as LabelProps } from "recharts/types/component/Label";
import { Answers, QuestionFS } from "../../../types/selfAssessment";
import { combineAnswers } from "../../../utils/selfAssessmentHelper";
import { ChartConfig, ChartContainer, ChartLegend } from "../../ui/chart";

interface Props {
  specs: {
    specTitle: string;
    specId: string;
    specPreview: string;
  }[];
  questionFs: QuestionFS;
  form: UseFormReturn<Answers, any, Answers>;
}

const renderCustomizedLabel = (props: LabelProps) => {
  const { x, y, width, height, value } = props;
  if (!value || +value < 5) {
    return null;
  }

  return (
    <text
      x={(x as number) + (width as number) - 5}
      y={(y as number) + (height as number) - 5}
      fill={"currentColor"}
      stroke="transparent"
      textAnchor="end"
      fontSize={16}
    >
      {(+value).toFixed(2)}%
    </text>
  );
};

const ResultChart: FunctionComponent<Props> = ({ questionFs, specs, form }) => {
  const specMap = useMemo(() => {
    return specs.reduce(
      (acc, spec) => {
        acc[spec.specId] = spec;
        return acc;
      },
      {} as Record<
        string,
        { specTitle: string; specId: string; specPreview: string }
      >,
    );
  }, [specs]);

  const selectedSpecIds = form.watch("specifications", []) as string[];

  // calculate the result
  // get the specs and tell the amount of nulls, trues and falses
  const values = form.watch();

  const chartData = useMemo(() => {
    return combineAnswers(values, questionFs)
      .questions.filter((q) => selectedSpecIds.includes(q.specId))
      .map((e) => ({
        specId: e.specId,
        ...e.elements
          .map((e) => e.subQuestions)
          .flat()
          .reduce(
            (acc, el) => {
              if (el.answer === null) {
                return {
                  ...acc,
                  null: acc.null + 1,
                };
              }

              if (el.answer === "yes") {
                return {
                  ...acc,
                  true: acc.true + 1,
                };
              } else if (el.answer === "no") {
                return {
                  ...acc,
                  false: acc.false + 1,
                };
              } else if (el.answer === "open") {
                return {
                  ...acc,
                  open: acc.open + 1,
                };
              } else {
                return {
                  ...acc,
                  null: acc.null + 1,
                };
              }
            },
            {
              null: 0,
              true: 0,
              false: 0,
              open: 0,
            },
          ),
      }))
      .map((e) => ({
        ...e,
        truePercentage: (e.true / (e.true + e.false + e.open + e.null)) * 100,
        falsePercentage: (e.false / (e.true + e.false + e.open + e.null)) * 100,
        openPercentage: (e.open / (e.true + e.false + e.open + e.null)) * 100,
        nullPercentage: (e.null / (e.true + e.false + e.open + e.null)) * 100,
      }));
  }, [values, selectedSpecIds, questionFs]);

  const chartConfig = {
    truePercentage: {
      label: "Ja",
      color: "var(--kern-color-feedback-success)",
    },
    falsePercentage: {
      label: "Nein",
      color: "var(--kern-color-feedback-danger)",
    },
    openPercentage: {
      label: "Offen",
      color: "var(--kern-color-action-default)",
    },
    nullPercentage: {
      label: "Keine Antwort",
      color: "var(--kern-color-feedback-info)",
    },
  } satisfies ChartConfig;
  return (
    <div className="mx-auto border p-xl pl-20 rounded-md">
      <ResponsiveContainer height={selectedSpecIds.length * 100}>
        <ChartContainer config={chartConfig}>
          <BarChart
            {...{
              overflow: "visible",
            }}
            layout="vertical"
            accessibilityLayer
            data={chartData}
          >
            <ChartLegend
              verticalAlign="bottom"
              content={({ payload }) => (
                <div className="flex justify-center gap-6 mt-4">
                  {payload?.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-sm"
                        style={{
                          backgroundColor: entry.color,
                          borderColor:
                            // @ts-expect-error is defined!
                            chartConfig[entry.dataKey as string]?.color,
                          borderWidth: 1,
                          borderStyle: "solid",
                        }}
                      />

                      <span className="text-sm">{entry.value}</span>
                    </div>
                  ))}
                </div>
              )}
            />
            <XAxis type="number" hide />
            <Bar
              background
              name="Nein"
              dataKey="falsePercentage"
              stackId="a"
              isAnimationActive={false}
              stroke="var(--kern-color-feedback-danger)"
              fill="var(--kern-color-feedback-danger-background)"
            >
              <LabelList
                dataKey="falsePercentage"
                content={renderCustomizedLabel}
                position="insideRight"
              />
            </Bar>
            <Bar
              barSize={45}
              name="Ja"
              dataKey="truePercentage"
              stackId="a"
              isAnimationActive={false}
              stroke="var(--kern-color-feedback-success)"
              fill="var(--kern-color-feedback-success-background)"
            >
              <LabelList
                dataKey="truePercentage"
                content={renderCustomizedLabel}
                position="insideRight"
              />
            </Bar>
            <Bar
              name="Offen"
              dataKey="openPercentage"
              stackId="a"
              isAnimationActive={false}
              stroke="var(--kern-color-action-default)"
              fill="var(--kern-color-action-state-indicator-tint-active)"
            >
              <LabelList
                dataKey="openPercentage"
                content={renderCustomizedLabel}
                position="insideRight"
              />
            </Bar>
            <Bar
              name="Keine Antwort"
              dataKey="nullPercentage"
              stackId="a"
              isAnimationActive={false}
              stroke="var(--kern-color-feedback-info)"
              fill="white"
            />
            <YAxis
              dataKey="specId"
              type="category"
              fill="white"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                fontWeight: 500,
              }}
              tickFormatter={(value) => specMap[value]?.specTitle}
            />
          </BarChart>
        </ChartContainer>
      </ResponsiveContainer>
    </div>
  );
};

export default ResultChart;
