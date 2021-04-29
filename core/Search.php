<?php
include_once("StringManager.php");

class Search
{  
    private static $elements = [];
    private static $stopWord = [];
    private static $maxCost = INF;
    private static $bestCost = INF;
    private static $bestRows = [];
    private static $output = [];

    public static function launch(string $cat, array $elements, string $keyWords, array $stopWord = [], int $maxCost = INF): void
    {    
        // le mot clef correspond au titre de la catégorie dans laquelle la recherche s'effectue.
        if (strpos(strtolower($keyWords), $cat) !== false)
        {
            self::$bestCost = -1000;
            self::$output[self::$bestCost][$cat] = $elements;
        }
        // si une catégorie complète est séléctionnée => ne pas effectuer de recherche détaillée.
        if (self::$bestCost == -1000)
        {
            return;
        }

        self::$elements[$cat] = $elements;
        self::$maxCost = $maxCost;
        self::$stopWord = $stopWord;

        self::match_words($elements, explode(" ", self::format_word($keyWords)), [$cat]);
    }

    private static function match_words(array $elements, array $keyWords, array $path): void
    {
        $path = isset($path[1]) ? $path[0] . '/' . $path[1] : $path[0];

        foreach($elements as $key => $element)
        {
            if (gettype($element) == 'array')
            {        
                self::match_words($element, $keyWords, [$path, $key]);
            }
            else
            {
                self::update_bestRows($element, $keyWords, $path);
            }
        }
    }

    public static function get_result(): array
    {
        $wordsToHighlight = [];

        foreach(self::$bestRows as $path => $infos)
        {
            self::$output[$infos['cost']] = !isset(self::$output[$infos['cost']]) ? [] : self::$output[$infos['cost']];

            $a = &self::$output[$infos['cost']];
            $b = &self::$elements;
            $path = explode('/', $path);

            $wordsToHighlight = array_merge($wordsToHighlight, $infos['words']);

            foreach($path as $key)
            {
                if (!array_key_exists($key, $a))
                {
                    $a[$key] = self::import_rowsFromArray($b[$key]);
                }
                // passer les réferences à l'étage suivant.
                $a = &$a[$key];
                $b = &$b[$key];
            }

            // s'il reste des informations disponibles plus en profondeur => copier toutes ces informations pour le résultat final.
            foreach($b as $child)
            {
                if (gettype($child) == 'array')
                    $a = $b;
            }
        }
        
        ksort(self::$output);
        return self::highlight_words(array_unique($wordsToHighlight), self::$output);
    }

    private static function update_bestRows(string $element, array $keyWords, string $path): void
    {
        $wordsToCheck = explode(" ", $element);

        foreach($wordsToCheck as $key_wtc => $wordToCheck)
        {
            foreach($keyWords as $keyWord)
            {
                if (array_search($wordToCheck, self::$stopWord) !== false)
                    break;

                if ($keyWord == '')
                    continue;
    
                $cost = Levenshtein(self::format_word($wordToCheck), $keyWord);

                if ($cost > self::$maxCost)
                    continue;

                if ($cost <= self::$bestCost)
                {
                    if ($cost < self::$bestCost)
                    {
                        self::$bestCost = $cost;
                        self::$bestRows = [];
                    }
                    if ($cost == self::$bestCost)
                    {
                        // s'il existe déjà une correspondance dans la rangée courrante, diminuer le coût de cette rangée.
                        if (isset(self::$bestRows[$path]))
                        {
                            self::$bestRows[$path]['cost'] = self::$bestRows[$path]['cost'] - 1;
                            array_push(self::$bestRows[$path]['words'], $wordsToCheck[$key_wtc]);
                        }
                        else
                        {
                            self::$bestRows[$path] = ['cost' => $cost, 'words' => [$wordsToCheck[$key_wtc]]];
                        }
                    }
                }
            }
        }
    }    

    private static function highlight_words(array $wordsToHighlight, array $subject): array
    {
        array_walk_recursive($subject, function(&$subject) use($wordsToHighlight)
        {
            foreach($wordsToHighlight as $word)
            {
                $subject = preg_replace("/\b$word\b/", "<span class='search-found'>" . $word . "</span>", $subject);
            }
        });
        return $subject;
    }

    private static function import_rowsFromArray(array &$b)
    {
        $output = [];
        foreach($b as $key => $value)
        {
            if (gettype($value) != 'array')
            {
                $output[$key] = $value;
            }
        }
        return $output;
    }

    private static function format_word(string $string): string
    {
        return strtolower(StringManager::remove_accents($string));
    }
};
?>