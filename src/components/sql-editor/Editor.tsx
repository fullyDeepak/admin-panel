'use client';

import AceEditor from 'react-ace';
export default function Editor() {
  return (
    <div>
      <AceEditor
        placeholder='Write you SQL here.'
        mode='mysql'
        theme='textmate'
        // onLoad={this.onLoad}
        // onChange={this.onChange}
        fontSize={18}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        // value={``}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
    </div>
  );
}
