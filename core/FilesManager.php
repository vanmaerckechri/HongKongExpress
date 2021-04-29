<?php
include_once("StringManager.php");

class FilesManager
{
    public static function loadJsonFile(string $filename): array
    {
        return json_decode(file_get_contents($filename), TRUE);
    }

    public static function loadAllJsonFiles(string $path): array
    {
        $output = [];
        $path = StringManager::convertToCleanPath($path);
        $filenames = scandir($path);
        foreach ($filenames as $filename)
        {
            // load only json files
            if (strpos($filename, ".json") !== false)
            {
                $content = self::loadJsonFile($path . $filename);
                $output[StringManager::convertToCleanLink($content['titre'])] = $content;
            }
        }
        return $output;
    }
};
?>