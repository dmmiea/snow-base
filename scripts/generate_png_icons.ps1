Add-Type -AssemblyName System.Drawing

function Generate-SnowIcon([int]$size, [string]$outputPath) {
    $bmp = [System.Drawing.Bitmap]::new($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # Background gradient
    $rect = [System.Drawing.Rectangle]::new(0, 0, $size, $size)
    $cTop = [System.Drawing.Color]::FromArgb(255, 11, 19, 43)
    $cBot = [System.Drawing.Color]::FromArgb(255, 2, 132, 199)
    $linBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new($rect, $cTop, $cBot, [float]45.0)
    
    # Fill rounded background
    $radius = [float]($size * 0.22)
    $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $d = [float]($radius * 2)
    $path.AddArc([float]0, [float]0, $d, $d, [float]180, [float]90)
    $path.AddArc([float]($size - $d), [float]0, $d, $d, [float]270, [float]90)
    $path.AddArc([float]($size - $d), [float]($size - $d), $d, $d, [float]0, [float]90)
    $path.AddArc([float]0, [float]($size - $d), $d, $d, [float]90, [float]90)
    $path.CloseFigure()
    
    $g.FillPath($linBrush, $path)

    # Mountain 2 (Back)
    $pts2 = @(
        [System.Drawing.PointF]::new([float]($size * 0.18), [float]($size * 0.8)),
        [System.Drawing.PointF]::new([float]($size * 0.42), [float]($size * 0.41)),
        [System.Drawing.PointF]::new([float]($size * 0.65), [float]($size * 0.8))
    )
    $m2Brush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(180, 56, 189, 248))
    $g.FillPolygon($m2Brush, $pts2)

    # Mountain 1 (Front)
    $pts1 = @(
        [System.Drawing.PointF]::new([float]($size * 0.33), [float]($size * 0.8)),
        [System.Drawing.PointF]::new([float]($size * 0.65), [float]($size * 0.3)),
        [System.Drawing.PointF]::new([float]($size * 0.95), [float]($size * 0.8))
    )
    $m1Rect = [System.Drawing.RectangleF]::new([float]0, [float]($size * 0.3), [float]$size, [float]($size * 0.5))
    $m1Brush = [System.Drawing.Drawing2D.LinearGradientBrush]::new($m1Rect, [System.Drawing.Color]::White, [System.Drawing.Color]::FromArgb(255, 14, 165, 233), [float]90.0)
    $g.FillPolygon($m1Brush, $pts1)

    # Snowflake Icon (White & Cyan)
    $cx = [float]($size * 0.3)
    $cy = [float]($size * 0.32)
    $r = [float]($size * 0.12)
    $pen = [System.Drawing.Pen]::new([System.Drawing.Color]::White, [float]([Math]::Max(2.0, [double]($size * 0.022))))
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

    # Snowflake cross lines
    $g.DrawLine($pen, [float]($cx - $r), [float]$cy, [float]($cx + $r), [float]$cy)
    $g.DrawLine($pen, [float]$cx, [float]($cy - $r), [float]$cx, [float]($cy + $r))
    $diag = [float]($r * 0.707)
    $g.DrawLine($pen, [float]($cx - $diag), [float]($cy - $diag), [float]($cx + $diag), [float]($cy + $diag))
    $g.DrawLine($pen, [float]($cx - $diag), [float]($cy + $diag), [float]($cx + $diag), [float]($cy - $diag))

    # Center dot
    $dotBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 56, 189, 248))
    $dotR = [float]($size * 0.02)
    $g.FillEllipse($dotBrush, [float]($cx - $dotR), [float]($cy - $dotR), [float]($dotR * 2), [float]($dotR * 2))

    # Text "SNOW BASE" at bottom
    if ($size -ge 192) {
        $fontSize = [float]($size * 0.065)
        $font = [System.Drawing.Font]::new("Arial", $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
        $textBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)
        $sf = [System.Drawing.StringFormat]::new()
        $sf.Alignment = [System.Drawing.StringAlignment]::Center
        $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
        $g.DrawString("SNOW BASE", $font, $textBrush, [float]($size * 0.5), [float]($size * 0.9), $sf)
    }

    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "✅ Created: $outputPath ($($size)x$($size))"
}

$iconDir = Join-Path $PSScriptRoot "..\icons"
Generate-SnowIcon 192 (Join-Path $iconDir "icon-192.png")
Generate-SnowIcon 512 (Join-Path $iconDir "icon-512.png")
