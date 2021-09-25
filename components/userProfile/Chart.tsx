import styled from "styled-components";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  data: {
    date: string;
    value: number;
  }[];
}

const Chart: React.FC<Props> = ({ data }) => {
  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 20, left: -30, bottom: 0 }}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4361ee" stopOpacity={0.7} />
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
            dot={{ stroke: "#5d78ee", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
export default Chart;

const ChartContainer = styled.div`
  height: 175px;
  width: 100%;
  overflow: hidden;

  line,
  text {
    fill: ${({ theme }) => theme.border} !important;
    stroke: ${({ theme }) => theme.border} !important;
  }
  text {
    stroke-width: 0px;
    font-size: 0.65rem;
  }

  .recharts-default-tooltip {
    padding: 0.15rem 0.5rem !important;
    font-size: 0.8rem !important;
    background: ${({ theme }) => theme.body} !important;
    border-radius: 5px;
    border: 1px solid ${({ theme }) => theme.border} !important;
    text-align: center;

    * {
      color: ${({ theme }) => theme.text} !important;
    }
  }
`;
