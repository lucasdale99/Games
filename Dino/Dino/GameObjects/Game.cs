using System;
using System.Collections.Generic;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Shapes;
using System.Windows.Threading;

namespace Dino.GameObjects
{
    public class Game
    {
        public double Width { get; set; }
        public double Height { get; set; }
        private Window GameWindow { get; set; }

        private IList<GameObject> GameObjects { get; set; }

        public Game(Window gameWindow)
        {
            GameWindow = gameWindow;
            Width = GameWindow.Width;
            Height = GameWindow.Height;
            GameWindow.Title = "Dino";

            GameObjects = new List<GameObject>();

            GameObjects.Add(new Dinosaur(this));
            GameObjects.Add(new Cactus(this));
        }

        public void Start()
        {
            var timer = new DispatcherTimer();
            timer.Interval = new TimeSpan(0, 0, 0, 0, 17);
            timer.Tick += (s, e) =>
            {
                foreach (var obj in GameObjects)
                {
                    obj.Update();
                }
            };
            timer.Start();
        }
        
        public void Render(Canvas canvas)
        {
            foreach (var obj in GameObjects)
            {
                obj.Render(canvas);
            }

            //ground
            Rectangle ground = new Rectangle()
            {
                Fill = Brushes.Black,
                Height = 2,
                Width = Width
            };
            Canvas.SetTop(ground, Height - 60);
            canvas.Children.Add(ground);

            GameWindow.KeyDown += (s, e) =>
            {
                foreach(var obj in GameObjects)
                {
                    obj.HandleKeyPress(s, e);
                }
            };
        }
    }
}
