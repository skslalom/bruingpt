import { useEffect, useState } from 'react';
import { Box, FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
interface ChooseAIModelProps {
    onModelChange: (model: string) => void;
  }
export function ChooseAIModel({ onModelChange }: ChooseAIModelProps) {
    const [model, setModel] = useState('Claude 3.5 Sonnet v2');
    const handleChange = (event: SelectChangeEvent<string>) => {
        const selectedModel = event.target.value as string;
        setModel(selectedModel);
        let modelId = '';
        if(selectedModel === 'Claude 3.5 Sonnet v2') {
          modelId = 'anthropic.claude-3-5-sonnet-20241022-v2:0';
        } else if(selectedModel === 'Claude 3.5 Haiku') {
          modelId = 'anthropic.claude-3-5-haiku-20241022-v1:0';
        }
      
        onModelChange(modelId);
    };

    useEffect(() => {
      onModelChange('anthropic.claude-3-5-sonnet-20241022-v2:0')
    }, [])
    
    return (
        <Box mt={4}>
          <FormControl sx={{ width: '50%' }}>
            <InputLabel sx={{ paddingBottom: '8px' }}>Select an AI Model</InputLabel>
            <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={model}
            label="Age"
            onChange={handleChange}
            >
                <MenuItem value={'Claude 3.5 Sonnet v2'}>Claude 3.5 Sonnet v2</MenuItem>
                <MenuItem value={'Claude 3.5 Haiku'}>Claude 3.5 Haiku</MenuItem>
            </Select>
            <FormHelperText>The default model is Claude 3.5 Sonnet v2</FormHelperText>
      </FormControl>
        </Box>
    );
}