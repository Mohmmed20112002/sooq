        document.getElementById('speedTestForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const url = document.getElementById('websiteUrl').value;
            const strategy = document.getElementById('strategy').value;
            const loading = document.getElementById('loading');
            const results = document.getElementById('results');
            const error = document.getElementById('error');
            const testBtn = document.getElementById('testBtn');

            // Reset UI
            loading.classList.add('active');
            results.classList.remove('active');
            error.classList.remove('active');
            testBtn.disabled = true;

            try {
                const response = await fetch('pagespeed.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ url: url, strategy: strategy })
                });

                // التحقق من حالة الاستجابة
                if (!response.ok) {
                    const errorText = await response.text();
                    let errorMessage = 'حدث خطأ في الاتصال';
                    try {
                        const errorData = JSON.parse(errorText);
                        errorMessage = errorData.error || errorMessage;
                    } catch (e) {
                        errorMessage = errorText || `خطأ ${response.status}: ${response.statusText}`;
                    }
                    throw new Error(errorMessage);
                }

                // محاولة تحليل JSON
                const responseText = await response.text();
                if (!responseText || responseText.trim() === '') {
                    throw new Error('الاستجابة فارغة من الخادم');
                }

                let data;
                try {
                    data = JSON.parse(responseText);
                } catch (e) {
                    console.error('Response text:', responseText);
                    throw new Error('خطأ في تحليل البيانات المستلمة: ' + e.message);
                }

                if (data.error) {
                    throw new Error(data.error);
                }

                displayResults(data);
                results.classList.add('active');
            } catch (err) {
                error.textContent = 'حدث خطأ: ' + err.message;
                error.classList.add('active');
                console.error('Error details:', err);
            } finally {
                loading.classList.remove('active');
                testBtn.disabled = false;
            }
        });

        function displayResults(data) {
            const scoreSection = document.getElementById('scoreSection');
            const metricsGrid = document.getElementById('metricsGrid');
            const opportunitiesDiv = document.getElementById('opportunities');

            // Display scores
            const score = data.lighthouseResult?.categories?.performance?.score * 100 || 0;
            const strategy = data.lighthouseResult?.configSettings?.emulatedFormFactor || 'mobile';
            const strategyName = strategy === 'mobile' ? 'موبايل' : 'سطح المكتب';

            scoreSection.innerHTML = `
                <div class="score-card ${strategy}">
                    <div class="score-label">نقاط الأداء (${strategyName})</div>
                    <div class="score-value">${Math.round(score)}</div>
                    <div class="score-label">${getScoreLabel(score)}</div>
                </div>
            `;

            // Display Core Web Vitals
            const metrics = data.lighthouseResult?.audits || {};
            const coreMetrics = [
                { key: 'first-contentful-paint', label: 'أول رسم للمحتوى', description: 'FCP' },
                { key: 'largest-contentful-paint', label: 'أكبر رسم للمحتوى', description: 'LCP' },
                { key: 'total-blocking-time', label: 'إجمالي وقت الحجب', description: 'TBT' },
                { key: 'cumulative-layout-shift', label: 'تراكم التحول التخطيطي', description: 'CLS' },
                { key: 'speed-index', label: 'مؤشر السرعة', description: 'Speed Index' },
                { key: 'interactive', label: 'وقت التفاعل', description: 'TTI' }
            ];

            let metricsHTML = '';
            coreMetrics.forEach(metric => {
                const audit = metrics[metric.key];
                if (audit) {
                    const value = audit.numericValue || audit.displayValue || 'N/A';
                    const score = audit.score !== null ? (audit.score * 100).toFixed(0) : 'N/A';
                    metricsHTML += `
                        <div class="metric-card">
                            <div class="metric-title">${metric.label}</div>
                            <div class="metric-value">${formatMetricValue(value, metric.key)}</div>
                            <div class="metric-description">${metric.description} - النقاط: ${score}</div>
                        </div>
                    `;
                }
            });

            metricsGrid.innerHTML = metricsHTML;

            // Display opportunities
            const opportunities = data.lighthouseResult?.audits || {};
            const opportunityKeys = Object.keys(opportunities).filter(key => {
                const audit = opportunities[key];
                return audit.details?.type === 'opportunity' && audit.score < 1;
            });

            if (opportunityKeys.length > 0) {
                let oppHTML = '<h3><span>💡</span> فرص التحسين</h3>';
                opportunityKeys.slice(0, 5).forEach(key => {
                    const audit = opportunities[key];
                    const savings = audit.details?.overallSavingsMs || 0;
                    oppHTML += `
                        <div class="opportunity-item">
                            <h4>${audit.title}</h4>
                            <p>${audit.description}</p>
                            ${savings > 0 ? `<p><strong>⚡ توفير محتمل:</strong> ${(savings / 1000).toFixed(2)} ثانية</p>` : ''}
                        </div>
                    `;
                });
                opportunitiesDiv.innerHTML = oppHTML;
            } else {
                opportunitiesDiv.innerHTML = '<h3><span>✅</span> لا توجد فرص تحسين كبيرة - موقعك ممتاز!</h3>';
            }
        }

        function formatMetricValue(value, key) {
            if (typeof value === 'number') {
                if (key.includes('time') || key.includes('paint') || key.includes('index') || key.includes('interactive')) {
                    return (value / 1000).toFixed(2) + ' ثانية';
                } else if (key.includes('shift')) {
                    return value.toFixed(3);
                } else {
                    return value.toFixed(0) + ' ms';
                }
            }
            return value;
        }

        function getScoreLabel(score) {
            if (score >= 90) return 'ممتاز ⭐⭐⭐';
            if (score >= 50) return 'جيد ⭐⭐';
            return 'يحتاج تحسين ⭐';
        }
        