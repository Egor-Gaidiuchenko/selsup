import React from 'react';

interface Param {
  id: number;
  name: string;
  type: 'string' | 'number' | 'select';
  options?: string[];
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Color {}

interface Model {
  paramValues: ParamValue[];
  colors: Color[];
}

interface Props {
  params: Param[];
  model: Model;
}

interface State {
  paramValues: ParamValue[];
}

export class ParamEditor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      paramValues: props.params.map(param => {
        const existing = props.model.paramValues.find(pv => pv.paramId === param.id);
        return {
          paramId: param.id,
          value: existing ? existing.value : ''
        };
      })
    };
  }

  handleChange = (paramId: number, value: string) => {
    this.setState(prevState => ({
      paramValues: prevState.paramValues.map(pv =>
        pv.paramId === paramId ? { ...pv, value } : pv
      )
    }));
  };

  public getModel(): Model {
    return {
      paramValues: this.state.paramValues,
      colors: []
    };
  }

  renderInput(param: Param, value: string) {
    if (param.type === 'number') {
      return (
        <input
          type="number"
          value={value}
          onChange={e => this.handleChange(param.id, e.target.value)}
        />
      );
    }

    if (param.type === 'select' && param.options) {
      return (
        <select
          value={value}
          onChange={e => this.handleChange(param.id, e.target.value)}
        >
          <option value="">Выберите...</option>
          {param.options.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type="text"
        value={value}
        onChange={e => this.handleChange(param.id, e.target.value)}
      />
    );
  }

  render() {
    return (
      <div>
        {this.props.params.map(param => {
          const value =
            this.state.paramValues.find(pv => pv.paramId === param.id)?.value || '';
          return (
            <div key={param.id} style={{ marginBottom: '10px' }}>
              <label>
                {param.name}:{' '}
                {this.renderInput(param, value)}
              </label>
            </div>
          );
        })}
      </div>
    );
  }
}
