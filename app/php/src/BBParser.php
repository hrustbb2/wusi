<?php

namespace src;

use phpDocumentor\Reflection\Types\This;

class BBParser {

    /**
     * ['code']
     * ['html']
     * ['class']
     * @var array
     */
    private $bbCodes;

    private $bbCodesStack = [];

    public function setBBCodes($bbCodes)
    {
        $this->bbCodes = $bbCodes;
    }

    public function parse($str)
    {
        $i = 0;
        $txt = '';
        while($i <= strlen($str) - 1){
            $subStr = substr($str, $i, 6);
            $bbCode = $this->isOpen($subStr);
            if($bbCode){
                $i += 2 + strlen($bbCode['code']);
                $class = ($bbCode['class']) ? ' class="' . $bbCode['class'] . '"' : '';
                $txt .= '<' . $bbCode['html'] . $class . '>';
                if(substr($bbCode['code'], 0, 1) != '/'){
                    $this->bbCodesStack[] = $bbCode;
                }
                continue;
            }
            $bbCode = $this->isClose($subStr);
            if($bbCode){
                $i += 3 + strlen($bbCode['code']);
                $txt .= '</' . $bbCode['html'] . '>';
                continue;
            }
            $txt .= substr($str, $i, 1);
            $i++;
        }
        while (count($this->bbCodesStack) > 0){
            $bbCode = array_shift($this->bbCodesStack);
            $txt .= '</' . $bbCode['html'] . '>';
        }
        return $txt;
    }

    private function isOpen($subStr)
    {
        foreach ($this->bbCodes as $bbCode){
            $needle = '[' . $bbCode['code'] . ']';
            if(strpos($subStr, $needle) === 0){
                return $bbCode;
            }
        }
        return false;
    }

    private function isClose($subStr)
    {
        $last = count($this->bbCodesStack) - 1;
        $bbCode = $this->bbCodesStack[$last] ?? false;
        if($bbCode){
            $needle = '[/' . $bbCode['code'] . ']';
            if(strpos($subStr, $needle) === 0){
                return array_shift($this->bbCodesStack);
            }
        }
        return false;
    }

}