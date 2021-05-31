import styled from "styled-components";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Chart({ data }) {
  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 45, left: 0, bottom: 0 }} baseValue={0}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="10%" stopColor="#4361ee" stopOpacity={0.8} />
              <stop offset="90%" stopColor="#4361ee" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#4361ee"
            fillOpacity={1}
            fill="url(#colorUv)"
            dot={{ stroke: "#5d78ee", strokeWidth: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

const ChartContainer = styled.div`
  height: 200px;
  width: 100vw;

  .recharts-default-tooltip {
    background: ${({ theme }) => theme.body} !important;
  }
`;
