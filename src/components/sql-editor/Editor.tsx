'use client';

import AceEditor from 'react-ace';
import 'ace-builds/src-min-noconflict/ext-language_tools';
import 'ace-builds/src-min-noconflict/mode-mysql';
import 'ace-builds/src-min-noconflict/theme-tomorrow';
export default function Editor() {
  return (
    <div>
      <AceEditor
        aria-label='query editor input'
        mode='mysql'
        theme='tomorrow'
        name={'abc'}
        fontSize={18}
        maxLines={6}
        minLines={6}
        width='100%'
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        placeholder={'Write your SQL query here...'}
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
        }}
        // value={currentQuery}
        // onChange={handleQueryChange}
        // className={classes.editorStyles}
        // showLineNumbers
      />
    </div>
  );
}
