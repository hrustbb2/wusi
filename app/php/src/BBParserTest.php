<?php

namespace src;

use PHPUnit\Framework\TestCase;

class BBParserTest extends TestCase {

    public function testFirst()
    {
        $parser = new BBParser();
        $bbCodes = [
            [
                'code' => 'b',
                'html' => 'span',
                'class' => 'bold-text',
            ]
        ];
        $parser->setBBCodes($bbCodes);
        $html = $parser->parse('a[b]bc[/b]d');

        $this->assertEquals('a<span class="bold-text">bc</span>d', $html);
    }

    public function testBR()
    {
        $parser = new BBParser();
        $bbCodes = [
            [
                'code' => '/br',
                'html' => '/br',
                'class' => null,
            ]
        ];
        $parser->setBBCodes($bbCodes);
        $html = $parser->parse('a[/br]d');

        $this->assertEquals('a</br>d', $html);
    }

    public function testNotClosed()
    {
        $parser = new BBParser();
        $bbCodes = [
            [
                'code' => 'b',
                'html' => 'span',
                'class' => 'bold-text',
            ]
        ];
        $parser->setBBCodes($bbCodes);
        $html = $parser->parse('a[b]d');

        $this->assertEquals('a<span class="bold-text">d</span>', $html);
    }

}