import { html, TemplateResult } from 'lit';
import '../src/virtual-template-ied.js';

export default {
  title: 'VirtualTemplateIed',
  component: 'virtual-template-ied',
  argTypes: {
    backgroundColor: { control: 'color' }
  }
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  title: string;
  backgroundColor?: string;
}

const Template: Story<ArgTypes> = ({
  title,
  backgroundColor = 'white'
}: ArgTypes) => html`
  <virtual-template-ied
    style="--virtual-template-ied-background-color: ${backgroundColor}"
    .title=${title}
  ></virtual-template-ied>
`;

export const App = Template.bind({});
App.args = {
  title: 'My app'
};
